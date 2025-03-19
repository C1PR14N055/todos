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

  [HttpGet]
  public IEnumerable<Todo> Get()
  {
    List<Todo> todos = new List<Todo>();
    using (StreamReader r = new StreamReader("./data.json"))
    {
      string json = r.ReadToEnd();
      todos = JsonConvert.DeserializeObject<List<Todo>>(json);
    }
    return todos;
  }
}