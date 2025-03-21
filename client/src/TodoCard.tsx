import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Todo } from './models/todo';
import './TodoCard.css';

interface TodoCardProps {
  todo: Todo;
  handleStatusUpdate: (id: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, handleStatusUpdate }) => {
  return (
    <Card style={{ position: 'relative' }}>
      <div className={`ribbon ribbon-${todo.type.toLowerCase()}`}>{todo.type}</div>
      <CardContent>
        <Typography color="textPrimary" gutterBottom>
          {todo.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          {new Date(todo.creationTime).toLocaleDateString()}
          <ScheduleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, ml: 2 }} />
          {new Date(todo.dueDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" sx={{ mt: 1, mb: 1 }}>
          &gt; {todo.content}
        </Typography>
        {todo.status === 'Active' ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => handleStatusUpdate(todo.id)}
          >
            Complete
            <RadioButtonUncheckedIcon fontSize="small" sx={{ ml: 1 }} />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            disabled
          >
            Completed
            <CheckCircleIcon fontSize="small" sx={{ ml: 1 }} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoCard;