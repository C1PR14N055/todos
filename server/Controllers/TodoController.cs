using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

[ApiController]
[EnableCors("AnyPolicy")]
[Route("api/todos")]
public class TodoController : ControllerBase
{
  private static List<Todo> _cachedTodos;
  private static DateTime _lastCacheTime;
  private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

  public class PaginatedResponse<T>
  {
    public IEnumerable<T> Items { get; set; }
    public int TotalPages { get; set; }
  }

  [HttpGet]
  public PaginatedResponse<Todo> Get(int pageNumber = 1, int pageSize = 5, string type = null, string fastSearch = null)
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

    // Filter todos by type if provided
    var filteredTodos = string.IsNullOrEmpty(type) ? _cachedTodos : _cachedTodos.Where(todo => todo.Type == type).ToList();

    // Filter todos by fastSearch if provided
    if (!string.IsNullOrEmpty(fastSearch))
    {
      filteredTodos = filteredTodos.Where(todo => todo.Title.Contains(fastSearch, StringComparison.OrdinalIgnoreCase)
      || todo.Content.Contains(fastSearch, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    // Calc total pages
    int totalPages = (int)Math.Ceiling(filteredTodos.Count / (double)pageSize);

    // Calc items to skip based on pageNumber & pageSize
    int skip = (pageNumber - 1) * pageSize;

    // Return paginated response
    return new PaginatedResponse<Todo>
    {
      Items = filteredTodos.Skip(skip).Take(pageSize),
      TotalPages = totalPages
    };
  }

  [HttpPut("{id}")]
  public IActionResult UpdateStatus(string id, [FromBody] Todo updatedTodo)
  {
    // TODO: Implement this method to DRY the code
    if (_cachedTodos == null || DateTime.Now - _lastCacheTime > CacheDuration)
    {
      using (StreamReader r = new StreamReader("./data.json"))
      {
        string json = r.ReadToEnd();
        _cachedTodos = JsonConvert.DeserializeObject<List<Todo>>(json);
        _lastCacheTime = DateTime.Now;
      }
    }

    var todo = _cachedTodos.FirstOrDefault(t => t.Id == id);
    if (todo == null)
    {
      return NotFound();
    }

    todo.Status = updatedTodo.Status;

    // Save the updated list back to the file
    using (StreamWriter w = new StreamWriter("./data.json"))
    {
      string json = JsonConvert.SerializeObject(_cachedTodos, Formatting.Indented);
      w.Write(json);
    }

    return NoContent();
  }
}