import React, { useEffect, useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("useEffect is running because count changed");
    setMessage(`The count is now ${count}`);
  }, [count]); // useEffect depends on 'count'

  console.log("Rendering with count:", count, "and message:", message);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Message: {message}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  );
}

export default MyComponent;
