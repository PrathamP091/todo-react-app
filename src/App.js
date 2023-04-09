import React, { useState } from 'react';
import { Table, Form, Input, DatePicker, Select, Button, Modal, Tag } from 'antd';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 150,
      sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix(),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 100,
      render: (tags) => (
        <span>
          {tags.map((tag) => {
            let color = tag.length > 5 ? '' : '';
            if (tag === '') {
              color = '';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'OPEN', value: 'OPEN' },
        { text: 'WORKING', value: 'WORKING' },
        { text: 'DONE', value: 'DONE' },
        { text: 'OVERDUE', value: 'OVERDUE' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Actions",
      width: 100,
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditTask(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteTask(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDeleteTask = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this task?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setTasks((pre) => {
          return pre.filter((task) => task.title !== record.title);
        });
      },
    });
  };

  const onEditTask = (record) => {
    setIsEditing(true);
    setEditingTask({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingTask(null);
  };

  const handleAddTask = (values) => {
    setTasks([
      ...tasks,
      {
        ...values,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        dueDate:
          values.dueDate && values.dueDate.format('YYYY-MM-DD HH:mm:ss'),
        tags:
          values.tags && values.tags.filter((tag, index) => values.tags.indexOf(tag) === index),
      },
    ]);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSearch = (value) => {
    const filteredTasks = tasks.filter((title) =>
      Object.values(title).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setTasks(filteredTasks);
  };

  return (
    <>
    <div className="App">
      <div className="container">
      <header className="App-header">
        <h2 className='head'>TODO.</h2>
    <Input.Search
      allowClear
      enterButton="Search"
      size="large"
      className='search'
      onSearch={handleSearch}
      style={{ marginBottom: '20px', width: '50vh'}}
    />
    <Button
        type="primary"
        size='large'
        className='button'
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '20px', fontFamily: 'Poppins', outerWidth: '20px'}}
      >
        Add Task
      </Button>
    <div>
      <Table
        columns={columns}
        dataSource={tasks}
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          y: 300,
        }}        
        className="table"      
        />
      <Modal
        title="Add Task"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddTask} style={{ marginBottom: '20px', fontFamily: 'Poppins'}}
>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title!' }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description!' }]}
          >
            <Input.TextArea maxLength={1000} />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="dueDate"
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Tags"
            name="tags"
          >
            <Select mode="tags" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            initialValue="OPEN"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select>
              <Select.Option value="OPEN">OPEN</Select.Option>
              <Select.Option value="WORKING">WORKING</Select.Option>
              <Select.Option value="DONE">DONE</Select.Option>
              <Select.Option value="OVERDUE">OVERDUE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
          title="Edit Task"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={(e) => {
            setTasks((pre) => {
              return pre.map((title) => {
                if (title.title === editingTask.title) {
                  return editingTask;
                } else {
                  return title;
                }
              });
            });
            resetEditing();
          }}
        >
          <Input
            value={editingTask?.title}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, title: e.target.value };
              });
            }}
          />
          <Input
            value={editingTask?.description}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, description: e.target.value };
              });
            }}
          />
          <Input
            value={editingTask?.dueDate}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, dueDate: e.target.value };
              });
            }}
          
          />
        
        </Modal>
    </div>
    </header>
    </div>
    </div>
    </>
  );
}

export default App;