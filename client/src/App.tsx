import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { Todo } from './models/todo';
import './App.css';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const classes = useStyles();

  useEffect(() => {
    (
      async function () {

        const data = await callApi();
        setTodos(data);

      }()
    )

  })

  const callApi = async () => {
    const response = await fetch('http://localhost:5001/api/todos');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: 1,
        fontWeight: 'bold',
      }}>
      <Grid container spacing={1}>
        {todos && todos.map((todo) => (
          <Grid item xs={10}>
            <Card >
              <CardContent>
                <Typography color="textPrimary" gutterBottom>
                  {todo.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {new Date(todo.creationTime).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {todo.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>))}
      </Grid>
    </Box>
  );
}


