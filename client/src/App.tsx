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
import Pagination from '@mui/material/Pagination';

import { Todo } from './models/todo';
import './App.css';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortOption, setSortOption] = useState<string>('Active');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    (
      async function () {
        const data = await callApi(pageNumber, pageSize, filterType);
        setTodos(data.items);
        setTotalPages(data.totalPages);
      }()
    )
  }, [pageNumber, pageSize, filterType]);

  const callApi = async (pageNumber: number, pageSize: number, type: string) => {
    const response = await fetch(`http://localhost:5001/api/todos?pageNumber=${pageNumber}&pageSize=${pageSize}&type=${type}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const handleStatusUpdate = async (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, status: 'Done' } : todo
      )
    );

    let currentTodo = todos.find((todo) => todo.id === id);
    currentTodo!.status = 'Done';
    // Persist the status change to the server
    await fetch(`http://localhost:5001/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentTodo),
    });

    // Re-sort the list after updating the status
    setTodos((prevTodos) =>
      prevTodos.sort((a, b) => {
        if (sortOption === 'Active') {
          return a.status === 'Active' ? -1 : 1;
        } else {
          return a.status === 'Done' ? -1 : 1;
        }
      })
    );
  };

  const sortedTodos = todos.sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
  })
  .sort((a, b) => {
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

      <FormControl variant="outlined" sx={{ m: 2, minWidth: 120 }}>
        <InputLabel id="filter-label">Filter by type:</InputLabel>
        <Select
          labelId="filter-label"
          value={filterType}
          onChange={handleFilterChange}
          label="Filter by type:"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Results">Results</MenuItem>
          <MenuItem value="Wins">Wins</MenuItem>
          <MenuItem value="Withdraw">Withdraw</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleSortOrderChange}>
        Sort by date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>

      <Grid container spacing={1}>
        {sortedTodos && sortedTodos.map((todo) => (
          <Grid item xs={10} key={todo.id}>
            <Card >
              <CardContent>
                <Typography color="textPrimary" gutterBottom>
                  {todo.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Created: {new Date(todo.creationTime).toLocaleDateString()} | Due: {new Date(todo.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  &gt; {todo.content}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {todo.status} - {todo.type}
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

      <Pagination
        count={totalPages}
        page={pageNumber}
        onChange={handlePageChange}
        color="primary"
      />

    </Box>
  );
}


