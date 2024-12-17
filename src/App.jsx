import { useEffect, useState } from 'react';
import TaskLists from './components/TaskLists';
import { BrowserRouter, Routes, Route } from 'react-router';
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    
    return unsubscribe
  }, [])

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <TaskLists user={user} /> : <SignIn/> } />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;