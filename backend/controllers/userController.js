const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')
const Manager = require('../models/managerModel')
const Task = require('../models/taskModel')
const Leave = require('../models/leaveModel')
const Thread = require('../models/threadModel')
const { LocalConvenienceStoreOutlined } = require('@material-ui/icons')


// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email, role })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  let user
  if(role == 'employee')
  {
    user = await User.create({
      name,
      email,
      password: hashedPassword
    })
  
  }
  else if(role == 'manager')
  {
    user = await Manager.create({
      name, 
      email,
      password: hashedPassword
    })
  }
  console.log(user)
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      success:true,
      type: role,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })
  const admin = await Admin.findOne({ email })
  const manager = await Manager.findOne({ email })
  console.log(user)
  console.log(admin)
  console.log(manager)
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({emp:true,
      admin:false,
      manager:false,
      token: generateToken(user._id),
      user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      type: 'employee',
    },})
  }
  else if(admin && password == admin.password)
  {
    res.json({
      emp:false,
      admin:true,
      manager:false,
      token: generateToken(admin._id),
      user: {
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      type: 'admin',
    },})
  } 
  else if(manager && (await bcrypt.compare(password, manager.password)))
  {
    res.json({
      emp:false,
      admin:false,
      manager:true,
      token: generateToken(manager._id),
      user: {
      _id: manager.id,
      name: manager.name,
      email: manager.email,
      type: 'manager',
    },})
  }
  else {
    // res.status(400)
    // throw new Error('Invalid credentials')
    res.send("fail");
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  console.log(req.user)
  const manager = await Manager.findById(req.user.manager)
  console.log(manager)
  const response = {
    name: req.user.name,
    email: req.user.email,
    manager: manager.name,
    manager_email: manager.email
  }
  console.log(response)
  res.status(200).json(response)
})

const getEmployee = asyncHandler(async(req, res) => {
  let list = []
  const user = User.find({})
  .exec((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
      for(let i = 0; i < data.length; i++) {
        list.push(data[i].email);
      }
    }
  res.status(200).json(list);
  });
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

const getManager = asyncHandler(async(req, res) => {
  let list = []
  const manager = Manager.find({})
  .exec((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
      for(let i = 0; i < data.length; i++) {
        list.push(data[i].email);
      }
    }
  res.status(200).json(list);
  });
})

const Match = asyncHandler(async(req, res) => {
  console.log(req.body)
  // const user = await User.findById({ email: req.body.employee})
  const manager = await Manager.find({ email: req.body.manager})
  const user = await User.findOneAndUpdate({email: req.body.employee}, {manager: manager[0]._id}, {new:true})
  res.status(200).json(user)
})

const getSelectEmployees = asyncHandler(async(req, res) => {
  console.log(req.body)
  console.log("helloooooooo")
  const user = await User.find({manager:req.body._id})
  let emails = []
  for(let i = 0; i < user.length; i++)
  {
    emails.push(user[i].email)
  }
  res.status(200).json(emails)
})

const Assignment = asyncHandler(async(req, res) => {
  const {title, description, email, deadline} = req.body
  const emp = await User.findOne({email: req.body.searchTerm})
  const id = emp._id

  console.log(title, description, deadline)
  const task = await Task.create({
    title: title,
    description: description,
    deadline: new Date(deadline),
    employee: id,
  }, {new: true})
  if(task)
  {
    res.status(200).json({status: 'success'})
  }
  else
  {
    res.status(400).json({status: 'failure'})
  }
  
  // console.log()
  // .then(() => console.log('Task created successfully'),
  // res.status(200).json({status: 'success'}))
  // .catch(error => console.error('Error creating task:', error),
  // res.status(200).json({status: 'failure'}));  
})

const getTasks = asyncHandler(async(req, res) => {
  console.log("hi")
  console.log(req.body)
  const task = await Task.find({employee: req.body.id})
  res.status(200).json(task)
})

const registerLeave = asyncHandler(async(req, res) => {
  const {subject, type, start, end, reason, employee} = req.body
  console.log(req.body)
  const user = await User.find({_id: employee})
  const manager = await Manager.find({_id: user[0].manager})
  console.log(user)
  const leave = await Leave.create({
    Subject: subject,
    Type: type,
    Start: start,
    End: end,
    Reason: reason,
    Employee: employee,
    Manager: user[0].manager,
    employeeEmail: user[0].email,
    managerEmail: manager[0].email,
  })
  console.log(leave)
  if(leave)
  {
    res.status(200).send({status: 'success'})
  }
  else
  {
    res.send({status: 'error'})
  }
})

const displayLeaveRequests = asyncHandler(async(req, res) => {
  const requests = await Leave.find({ $and: [ { approved: { $ne: true } }, { Manager: req.body.manager }]})
  console.log(req.body)
  console.log(requests)
  res.send(requests)
})

const grant = asyncHandler(async(req, res) => {
  const update = await Leave.updateOne({_id: req.body.id}, {$set:{approved: true}}, {new: true})
  console.log(update)
  res.status(200).json({status: 'success'})
})

const registerMessage = asyncHandler(async(req, res) => {
  console.log(req.body)
  const message = await Thread.create({
    text: req.body.message,
    task_id: req.body.id
  })
  console.log(message)
  res.status(200).json({status: 'success'})
})

const fetchMessage = asyncHandler(async(req, res) => {
  console.log(req.body)
  const messages = await Thread.find({task_id: req.body.id})
  console.log(messages)
  res.status(200).json(messages)
})

const getSelectTasks = asyncHandler(async(req, res) => {
  console.log(req.body)
  const user = await User.find({email: req.body.email})
  const tasks = await Task.find({employee: user[0]._id})
  console.log(tasks)
  res.status(200).json(tasks)
})

const deleteTask = asyncHandler(async(req, res) => {
  console.log(req.body)
  const task = await Task.deleteMany({_id: req.body.id})
  const messages = await Thread.deleteMany({task_id: req.body.id})
  console.log(task)
  console.log(messages)
  res.status(200).json({status: 'success'})
})

const suggestions = asyncHandler(async(req, res) => {
  console.log(req.body)
  const user = await User.find({manager:req.body._id})
  res.status(200).json(user)
})
const get = asyncHandler(async(req, res) => {
  console.log(req.body)
  const name = await User.find({manager: req.body.manager, name: req.body.search})
  const email = await User.find({manager: req.body.manager, email: req.body.search})
  console.log(name)
  console.log(email)
  if(name.length > 0)
  {
    console.log('name')
    res.status(200).json(name)
  }
  else if(email.length > 0)
  {
    console.log('email')
    res.status(200).json(email)
  }
  else
  {
    console.log('Employee Not Found')
    res.status(200).json({message:'Employee not found'})
  }
})

const getSelectedSuggestions = asyncHandler(async(req, res) => {
  const user = await User.find({manager: req.body._id})
  let emails = []
  let names = []
  for(let i = 0; i < user.length; i++)
  {
    emails.push(user[i].email)
  }
  for(let i = 0; i < user.length; i++)
  {
    names.push(user[i].name)
  }
  res.status(200).json(emails.concat(names));
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getEmployee,
  getManager,
  Match,
  getSelectEmployees,
  Assignment,
  getTasks,
  registerLeave,
  displayLeaveRequests,
  grant,
  registerMessage,
  fetchMessage,
  getSelectTasks,
  deleteTask,
  suggestions,
  getSelectedSuggestions,
  get,
}
