using Newtonsoft.Json;


public class Todo
{
  [JsonProperty("id")]
  public string Id { get; set; }
  [JsonProperty("title")]
  public string Title { get; set; }
  [JsonProperty("content")]
  public string Content { get; set; }
  [JsonProperty("creationTime")]
  public long CreationTime { get; set; }
  [JsonProperty("dueDate")]
  public long DueDate { get; set; }
  [JsonProperty("status")]
  public string Status { get; set; }
  [JsonProperty("type")]
  public string Type { get; set; }
}
