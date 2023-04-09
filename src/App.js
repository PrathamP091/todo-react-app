import React, { useState } from 'react';                                              // importing components 
import { Table, Form, Input, DatePicker, Select, Button, Modal, Tag } from 'antd';    // and css file
import moment from 'moment';                                                          // 
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";                     // 
import "antd/dist/reset.css";                                                         // 
import './App.css';                                                                   //

  //  "useState" is a Hook in React that lets you add state to functional components. It returns a pair of values: the current state and a function that updates it. You can use it to keep track of data that changes over time and re-render the component when the state changes

function App() {                                     // functional component called App
  const [tasks, setTasks] = useState([]);            // tasks is initialized as an empty array and can be updated using the setTasks function
  const [form] = Form.useForm();                     //created using the Form.useForm() method from the antd library
  const [isModalVisible, setIsModalVisible] = useState(false);      //control the visibility
  const [isEditing, setIsEditing] = useState(false);                //used to track whether the user is currently editing a task
  const [editingTask, setEditingTask] = useState(null);             //used to store the task that is currently being edited
  
  const columns = [                  // used to configure the columns of a table component
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),    // sorts the rows by their timestamp values
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      sorter: (a, b) => a.title.localeCompare(b.title),     // sorts the rows by their title values
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
      sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix(),      // sorts the rows by their due date values
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 100,
      render: (tags) => (         // render function specifies how to display the tags
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
      render: (record) => {            // render function specifies how to display the tags
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

  const onDeleteTask = (record) => {                                    // The 'onDeleteTask' function takes a record as its argument and 
    Modal.confirm({                                                     // displays a confirmation modal when called. If the user confirms
      title: "Are you sure, you want to delete this task?",             // the deletion, the function updates the tasks
      okText: "Yes",                                                    // state by removing the task with the same title as the record
      okType: "danger",                                                 
      onOk: () => {                                                     
        setTasks((pre) => {                                             
          return pre.filter((task) => task.title !== record.title);     
        });
      },
    });
  };

  const onEditTask = (record) => {              // The onEditTask function takes a record as its argument and sets the isEditing state to 
    setIsEditing(true);                         // true and the editingTask state to the record when called
    setEditingTask({ ...record });
  };

  const resetEditing = () => {                  // The resetEditing function sets the isEditing state to false and the editingTask state to 
    setIsEditing(false);                        // null when called
    setEditingTask(null);
  };

  const handleAddTask = (values) => {           // The handleAddTask function takes a values object as its argument and adds a new task to  
    setTasks([                                  // the tasks state when called. The new task is created by spreading the values
      ...tasks,                                 // object and adding additional properties such as timestamp, dueDate, and tags.
      {                                         // The function also resets the form fields and sets the isModalVisible state to false.
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

  const handleSearch = (value) => {                          // The handleSearch function takes a search value as its argument and updates the 
    const filteredTasks = tasks.filter((title) =>            // tasks state with tasks that match the search value when called.
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
    <Input.Search                                         // Search Box //
      allowClear
      enterButton="Search"
      size="large"
      className='search'
      onSearch={handleSearch}
      style={{ marginBottom: '20px', width: '50vh'}}
    />
    <Button                                              // Button //
        type="primary"
        size='large'
        className='button'
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '20px', fontFamily: 'Poppins', outerWidth: '20px'}}
      >
        Add Task
      </Button>
    <div>
      <Table                                             // ant table compomemt //
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
      <Modal                                            // Add Task dialogue box //
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
      <Modal                                // Edit and Delete dialogue box //
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