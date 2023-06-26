import React from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown />
      <CTable hover striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Nama Barang</CTableHeaderCell>
            <CTableHeaderCell scope="col">Stok</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">1</CTableHeaderCell>
            <CTableDataCell>Sabun</CTableDataCell>
            <CTableDataCell>50000</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">2</CTableHeaderCell>
            <CTableDataCell>Pewangi</CTableDataCell>
            <CTableDataCell>24000</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </>
  )
}

export default Dashboard
