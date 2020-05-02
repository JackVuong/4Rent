import React, { useState, useEffect} from 'react';
import { Table, Button, message, Divider, Popconfirm } from 'antd';
import { firebase } from '../../firebase';
import { connect } from 'react-redux'
import {addCustomer} from './../../actions'
import _ from 'lodash';
import CustomerForm from '../Form/CustomerForm';
const success = () => {
  message.success('Success')
};


const Customer = props => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [cusEdit, setCusEdit] = useState(null);
  const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Phone',
  dataIndex: 'phone',
  key: 'phone',
} , {
  title: 'Note',
  dataIndex: 'note',
  key: 'note',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a onClick={()=> onUpdate(record.cusID)}>Update</a>
      <Divider type='vertical' />
      <Popconfirm title='Delete?' onConfirm={() => onDelete(record.cusID)} okText='Ok' cancelText='Cancel'>
      <a>Delete</a>
      </Popconfirm>
    </span>
  )}];


  const showModal = () => {
    setVisible(true);
  }

  const onDelete = (cusID) => {
    firebase.update(`Customer/${cusID}`, null);
    props.getLatestData();
  }


  const  onUpdate = (cusID) => {   
      setIsEdit(true);
      setCusEdit(_.find(props.customerStore, ['cusID', cusID]));
      setVisible(true);
  }

  const onCreate = (values) => {
      firebase.getLastIndex('Customer').then((lastIndex) => addCustomer(lastIndex, values))
      success()
      setVisible(false);

  }

  const addCustomer = (lastIndex, values) => {
      let newIndex = parseInt(lastIndex) + 1;;
      if(isEdit) {
        newIndex = cusEdit.cusID;
      }
      let newCustomer= {
        cusID: newIndex,    
        name: values.name,
        phone: values.phone || '',
        note: values.note || ''
      }
      props.add(newIndex, newCustomer);
  }

  const onCancel = (e) => {
    setVisible(false);
    setIsEdit(false);
    setCusEdit(null);
  }
    return (
      <div>
        <CustomerForm
                visible={visible}
                onCancel={onCancel}
                onCreate={onCreate}
                isEdit={isEdit}
                cusEdit={cusEdit}
        />
        <Button type='primary' className='btn' onClick={showModal}>Add new</Button> 
        <Table dataSource={props.customerStore} columns={columns} />
      </div>
    );
}

const mapStateToProps = (state) => {
  return {
    customerStore : state.customerStore
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    add: (index, customer) => {
      dispatch(addCustomer(index, customer));
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(Customer);