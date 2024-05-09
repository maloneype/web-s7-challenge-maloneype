import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import schemas from './schemas'
import axios from 'axios'

// 👇 Here you will create your schema.

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppingList = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialFormValues = {
  fullName: "",
  size: "",
  toppings: []
}

const initialFormErrors = {
  fullName: "",
  size: ""
}

export default function Form() {
  const [values, setValues] = useState(initialFormValues)
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [submitEnabled, setSubmitEnabled] = useState(false)

  useEffect(() => {
    schemas.userSchema.isValid(values).then(setSubmitEnabled)
    // console.log(values)
    
  }, [values])

  const onChange = evt => {
    let { value, type, name, checked } = evt.target
    let newToppings
    setSuccess(false)
    if (type === "checkbox") {
      // debugger
      if (checked === true) {
        newToppings = [...values.toppings, value]
      } else {
        newToppings = values.toppings.filter(topping => (topping !== value))
      }
      setValues({...values, toppings: newToppings})
    } else {
      setValues({...values, [name]: value})
      Yup.reach(schemas.userSchema, name).validate(value)
        .then(() => setFormErrors(e => ({ ...e, [name]: "" })))
        .catch(err => setFormErrors(e => ({ ...e, [name]: err.errors[0] })))
    }
  }
  const resetFormValues = () => {
    setValues(initialFormValues)

  }

  const submitForm = evt => {
    evt.preventDefault()
    setSubmitEnabled(false)
    axios.post("http://localhost:9009/api/order", values)
      .then(res => {
        resetFormValues()
        setSuccess(res.data.message)
        setFailure()
      })
      .catch(err => {
        setFailure(err.response.data.message)
        setSuccess()
      })
      .finally(() => {  
        setSubmitEnabled(true)
      })
  }

  return (
    <form onSubmit={submitForm}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" 
            name="fullName" type="text" value={values.fullName}
            onChange={onChange} />
        </div>
        {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select name="size" id="size" onChange={onChange} value={values.size}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            {/* Fill out the missing options */}
          </select>
        </div>
        {formErrors.size && <div className='error'>{formErrors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppingList.map( topping => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type="checkbox"
              value={topping.topping_id}
              checked={values.toppings.includes(topping.topping_id)}
              onChange={onChange}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!submitEnabled} />
    </form>
  )
}
