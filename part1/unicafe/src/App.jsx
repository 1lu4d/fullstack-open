import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const Average = (good, neutral, bad) => {
  const total = good + neutral + bad;
  if (total === 0) return 0;
  
  return (good + bad * -1) / total;
};

const Positive = (good, neutral, bad) => {
    return(good / (good + bad + neutral) * 100)
}


const StatisticLine = (props) => {
  return (
    <tr>
      <td>{ props.text }</td>
      <td> { props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.good == 0  && props.bad == 0 && props.neutral == 0)
  {
    return(
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  } 
  const good = props.good;
  const neutral = props.neutral;
  const bad = props.bad;

  return(
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={ good }/>     
          <StatisticLine text="neutral" value={ neutral }/>
          <StatisticLine text="bad" value={ bad } />
          <StatisticLine text="all" value={ bad + neutral + good} />
          <StatisticLine text="Average" value={Average(good, neutral, bad)} />
          <StatisticLine text="Positive" value={Positive(good, neutral, bad) + "%"}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App