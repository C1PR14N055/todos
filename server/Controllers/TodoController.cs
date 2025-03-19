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
  private static List<Todo> _cachedTodos;
  private static DateTime _lastCacheTime;
  private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

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
    if (_cachedTodos == null || DateTime.Now - _lastCacheTime > CacheDuration)
    {
      using (StreamReader r = new StreamReader("./data.json"))
      {
        string json = r.ReadToEnd();
        _cachedTodos = JsonConvert.DeserializeObject<List<Todo>>(json);
        _lastCacheTime = DateTime.Now;
      }
    }

    // Calc total pages
    int totalPages = (int)Math.Ceiling(_cachedTodos.Count / (double)pageSize);

    // Calc items to skip based on pageNumber & pageSize
    int skip = (pageNumber - 1) * pageSize;

    // Return paginated response
    return new PaginatedResponse<Todo>
    {
      Items = _cachedTodos.Skip(skip).Take(pageSize),
      TotalPages = totalPages
    };
  }
}