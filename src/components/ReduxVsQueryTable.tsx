export const ReduxVsQueryTable = () => {
  return (
    <table className="redux-vs-query-table">
      <thead>
        <tr>
          <th>Redux</th>
          <th>React-query + React-location</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Any state</td>
          <td>Server-state</td>
        </tr>
        <tr>
          <td>Familiar pattern (or is it?), provides structure</td>
          <td>Simple, needs less boilerplate</td>
        </tr>
        <tr>
          <td>Code driven</td>
          <td>Configuration driven</td>
        </tr>
        <tr>
          <td>Choose your own middleware</td>
          <td>Choose your own fetching api</td>
        </tr>
        <tr>
          <td>Cache invalidation left to you</td>
          <td>Cache invalidation made simple</td>
        </tr>
        <tr>
          <td>Selecting and memoizing tricky</td>
          <td>Structural sharing built in</td>
        </tr>
        <tr>
          <td>Excellent dev tools</td>
          <td>Some kind of dev tools</td>
        </tr>
        <tr>
          <td>Does not rely on Promises, can use e.g. Observables or Futures</td>
          <td>Promise based</td>
        </tr>
        <tr>
          <td>Flexible and lots of examples of different approaches</td>
          <td>Examples growing, but might be harder to image alternative usages</td>
        </tr>
      </tbody>
    </table>
  )
}
