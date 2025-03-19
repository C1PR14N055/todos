using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


[ApiController]
[EnableCors("AnyPolicy")]
[Route("api/todos")]
public class TodoController : ControllerBase
{
  private static readonly string[] Summaries = new[]
  {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

  private readonly ILogger<TodoController> _logger;

  public TodoController(ILogger<TodoController> logger)
  {
    _logger = logger;
  }

  public class PaginatedResponse<T>
  {
    public IEnumerable<T> Items { get; set; }
    public int TotalPages { get; set; }
  }

  [HttpGet]
  public PaginatedResponse<Todo> Get(int pageNumber = 1, int pageSize = 5)
  {
    List<Todo> todos = new List<Todo>();
    using (StreamReader r = new StreamReader("./data.json"))
    {
      string json = r.ReadToEnd();
      todos = JsonConvert.DeserializeObject<List<Todo>>(json);
    }

    // Calc total pages
    int totalPages = (int)Math.Ceiling(todos.Count / (double)pageSize);

    // Calc items to skip based on pageNumber & pageSize
    int skip = (pageNumber - 1) * pageSize;

    // Return paginated response
    return new PaginatedResponse<Todo>
    {
      Items = todos.Skip(skip).Take(pageSize),
      TotalPages = totalPages
    };
  }
}