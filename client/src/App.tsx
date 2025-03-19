import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button, SelectChangeEvent } from '@mui/material';

import { Todo } from './models/todo';
import './App.css';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortOption, setSortOption] = useState<string>('Active');
  // const classes = useStyles();

  useEffect(() => {
    (
      async function () {
        const data = await callApi();
        setTodos(data);
      }()
    )
  }, []);

  const callApi = async () => {
    const response = await fetch('http://localhost:5001/api/todos');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

  const handleStatusUpdate = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, status: 'Done' } : todo
      )
    );
  };

  const sortedTodos = todos.sort((a, b) => {
    if (sortOption === 'Active') {
      return a.status === 'Active' ? -1 : 1;
    } else {
      return a.status === 'Done' ? -1 : 1;
    }
  });

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

      <FormControl variant="outlined" sx={{ m: 2, minWidth: 120 }}>
        <InputLabel id="sort-label">Order by status:</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          onChange={handleSortChange}
          label="Order by status:"
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={1}>
        {sortedTodos && sortedTodos.map((todo) => (
          <Grid item xs={10} key={todo.id}>
            <Card >
              <CardContent>
                <Typography color="textPrimary" gutterBottom>
                  {todo.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {new Date(todo.creationTime).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  &gt; {todo.content}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {todo.status}
                </Typography>

                {todo.status === 'Active' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusUpdate(todo.id)}
                  >Mark as Done</Button>
                )}

              </CardContent>
            </Card>
          </Grid>))}
      </Grid>
    </Box>
  );
}


