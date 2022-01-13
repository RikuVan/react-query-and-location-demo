export const Terms = () => {
  return (
    <>
      <h3>Key terms</h3>
      <dl>
        <dt>prefetching</dt>
        <dd>add data to cache which is automatically stale</dd>
        <dt>stale time</dt>
        <dd>time data is considered fresh or before triggering refetch (default is 0!)</dd>
        <dt>cache time</dt>
        <dd>
          time until an entry is cache before replacing and garbage collected, regardless of whether
          it is needed (default 5 min)
        </dd>
        <dt>isFetching</dt>
        <dd>async query has yet to resolve</dd>
        <dt>isLoading</dt>
        <dd>isFetching + no cached data</dd>
      </dl>
    </>
  )
}
