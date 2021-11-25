/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Input, Space, Table } from 'antd'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'

import { SearchOutlined } from '@ant-design/icons'

export const TableAnt = (): JSX.Element => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

  const getColumnSearchProps = dataIndex => ({
    filterDropDown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => <div></div>,
  })

  return <div></div>
}
