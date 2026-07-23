const Course = ( { course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts}/>
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <tr>
      <td>
        {part.name} 
      </td>
      <td>
        {part.exercises}
      </td>
    </tr>
  )
}

const Total = ({total}) => {
  return (
    <p><b>Total of {total} exercises</b></p>
  )
}

const Content = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)
  return (
    <div>
      <table>
        <tbody>
          {parts.map(part =>
            <Part key={part.id} part={part}/>
          )}
        </tbody>
      </table>
      <Total total={ total }/>
    </div>
  )
}

const Header = ({ course }) => {
  return (
    <h2>{ course.name }</h2>
  )
}
export default Course