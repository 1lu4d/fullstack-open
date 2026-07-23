import { useState } from "react";

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const App = () => {
  const anecdotes = [
    { text: "If it hurts, do it more often.", votes: 0 },
    {
      text: "Adding manpower to a late software project makes it later!",
      votes: 0,
    },
    {
      text: "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      votes: 0,
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      votes: 0,
    },
    { text: "Premature optimization is the root of all evil.", votes: 0 },
    {
      text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      votes: 0,
    },
    {
      text: "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
      votes: 0,
    },
    { text: "The only way to go fast, is to go well.", votes: 0 },
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(anecdotes);

  const NextAnecdote = () => {
    let nextRandom;

    do {
      nextRandom = Math.floor(Math.random() * 8);
    } while (nextRandom === selected);

    setSelected(nextRandom);
  };

  const VoteFor = () => {
    const updatedAnecdotes = [...votes];
    updatedAnecdotes[selected].votes += 1;
    setVotes(updatedAnecdotes);
  };

  const getMostVotedAnecdote = () => {
    return votes.reduce((mostVoted, current) => {
      return current.votes > mostVoted.votes ? current : mostVoted;
    });
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {votes[selected].text} Votes: {votes[selected].votes}
      </p>
      <Button onClick={NextAnecdote} text="next anecdote" />
      <Button onClick={VoteFor} text="Vote" />
      <h1>Anecdote with most votes</h1>
      <p>
        {getMostVotedAnecdote().text} - Votes: {getMostVotedAnecdote().votes}
      </p>
    </div>
  );
};

export default App;
