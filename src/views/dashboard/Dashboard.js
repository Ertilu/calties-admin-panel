import React, { useCallback, useEffect, useState } from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
  CTableDataCell,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import Loading from 'src/components/Loading'
import ModalConfirmation from '../../components/ModalConfirmation'
import { spacing } from 'src/shared/style.const'
import { formatRupiah } from 'src/shared/utils/formatter'
import { useDebounce } from 'src/shared/utils/debounce'
import InventoryService from 'src/services/inventory.service'

const Dashboard = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const debouncedValue = useDebounce(search, 600)
  const [loading, setLoading] = useState(true)
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false)
  const [idToDelete, setIdToDelete] = useState('')

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getData = useCallback(() => {
    InventoryService.getAllData({ search: debouncedValue })
      .then((res) => {
        setLoading(false)
        setData(res?.results)
      })
      .catch(() => setLoading(false))
  }, [debouncedValue])

  const onSearch = useCallback(({ target: { value } }) => {
    setSearch(value)
  }, [])

  const onEdit = useCallback(
    async (id) => {
      setLoading(true)
      const res = await InventoryService.getDetail(id)
      if (res?.id) {
        setLoading(false)
        dispatch({ type: 'edit_inventory', inventoryData: res })
        navigate('/forms')
      }
    },
    [dispatch, setLoading, navigate],
  )

  const onDelete = useCallback(async () => {
    setLoading(true)
    setModalConfirmDelete(false)
    await InventoryService.delete(idToDelete)
    getData()
  }, [idToDelete, getData])

  return (
    <>
      <CCard>
        <Loading visible={loading} />
        <ModalConfirmation
          visible={modalConfirmDelete}
          onClose={() => setModalConfirmDelete(false)}
          onOk={onDelete}
        />
        <CCardHeader>
          <div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <h4>Data Barang</h4>
              <CInputGroup style={{ width: 300, height: 30 }}>
                <CFormInput
                  placeholder="Cari Data"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  size="sm"
                  icon={cilSearch}
                  onChange={onSearch}
                />
                <CInputGroupText>
                  <CIcon icon={cilSearch} size="lg" />
                </CInputGroupText>
              </CInputGroup>
            </div>
            <CButton
              color="primary"
              style={{ margin: `${spacing[8]} 0` }}
              onClick={() => navigate('/forms')}
            >
              Tambah Data
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CTable hover striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Nama Barang</CTableHeaderCell>
                <CTableHeaderCell scope="col">Vendor</CTableHeaderCell>
                <CTableHeaderCell scope="col">Harga</CTableHeaderCell>
                <CTableHeaderCell scope="col">In</CTableHeaderCell>
                <CTableHeaderCell scope="col">Out</CTableHeaderCell>
                <CTableHeaderCell scope="col">Sisa</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data?.map((d, idx) => {
                return (
                  <CTableRow key={idx.toString()}>
                    <CTableDataCell scope="row" align="middle">
                      {d?.name || '-'}
                    </CTableDataCell>
                    <CTableDataCell align="middle">{d?.vendor || '-'}</CTableDataCell>
                    <CTableDataCell align="middle">{formatRupiah(d?.price || 0)}</CTableDataCell>
                    <CTableDataCell align="middle">{d?.in || 0}</CTableDataCell>
                    <CTableDataCell align="middle">{d?.out || 0}</CTableDataCell>
                    <CTableDataCell align="middle">{d?.remaining || 0}</CTableDataCell>
                    <CTableDataCell align="middle">
                      <CDropdown>
                        <CDropdownToggle color="transparent"></CDropdownToggle>
                        <CDropdownMenu
                          style={{
                            position: 'absolute',
                            backgroundColor: 'red',
                            width: 'auto',
                            height: 'auto',
                            top: -20,
                            left: -40,
                          }}
                        >
                          <CDropdownItem href="#" onClick={() => onEdit(d?.id)}>
                            Edit
                          </CDropdownItem>
                          <CDropdownItem
                            href="#"
                            onClick={() => {
                              setIdToDelete(d?.id)
                              setModalConfirmDelete(true)
                            }}
                          >
                            Hapus
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
