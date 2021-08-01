export const query =
  'query subgraphs($name: String, $first: Int){\nsubgraphSearch(text: $name){\nid\ndisplayName}\n}'
