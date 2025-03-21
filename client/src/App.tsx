import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button, SelectChangeEvent, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import TodoCard from './TodoCard';
import { Todo } from './models/todo';
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortOption, setSortOption] = useState<string>('Active');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (
      async function () {
        setIsLoading(true);
        const data = await callApi(pageNumber, pageSize, filterType, searchKeyword);
        setTodos(data.items);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      }()
    )
  }, [pageNumber, pageSize, filterType, searchKeyword]);

  const callApi = async (pageNumber: number, pageSize: number, type: string, fastSearch: string) => {
    const response = await fetch(`http://localhost:5001/api/todos?pageNumber=${pageNumber}&pageSize=${pageSize}&type=${type}&fastSearch=${fastSearch}`);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
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
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ mt: 5 }} />
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
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
              <InputLabel id="filter-label">Type:</InputLabel>
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
  
            <TextField
              label="Search"
              variant="outlined"
              value={searchKeyword}
              onChange={handleSearchChange}
              sx={{ m: 2, minWidth: 120 }}
            />
  
            <Button variant="contained" onClick={handleSortOrderChange}>
              Sort by date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </Button>
          </Box>
  
          <Grid container spacing={1}>
            {sortedTodos && sortedTodos.map((todo) => (
              <Grid item xs={12} md={3} sx={{ p: 1 }} key={todo.id}>
                <TodoCard todo={todo} handleStatusUpdate={handleStatusUpdate} />
              </Grid>
            ))}
          </Grid>
  
          <Pagination
            sx={{ mt: 2, mb: 2 }}
            count={totalPages}
            page={pageNumber}
            onChange={handlePageChange}
            color="primary"
          />
        </>
      )}
    </Box>
  );
}