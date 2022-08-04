import Login from 'components/Users/Login'
import Logout from 'components/Users/Logout'
import { selectUser } from 'modules/services'
import React from 'react'
import { useSelector } from 'react-redux'

const OldLoginPage = () => {
  const user = useSelector(state=>state.user)

  return (
    <div>
      {user ? <Logout /> : <Login />}
    </div>
  )
}

export default OldLoginPage