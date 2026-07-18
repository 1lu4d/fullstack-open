const Header = (props) => {
  return (
    <div>
      <h1>{ props.course }</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.content[0].part} exercises={props.content[0].exercises} />
      <Part name={props.content[1].part} exercises={props.content[1].exercises} />
      <Part name={props.content[2].part} exercises={props.content[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  let total = 0;
  for (let exercise of props.exercises) {
    total += exercise;
  }
  
  return (
    <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const content = [{part:part1, exercises:exercises1}, {part:part2, exercises:exercises2}, {part:part3, exercises:exercises3}]
  const exercises = [exercises1, exercises2, exercises3]

  return (
    <div>
      <Header course={course}/>
      <Content content={content}/>
      <Total exercises={exercises}/>  
    </div>
  )
}

export default App