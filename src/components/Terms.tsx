export const Terms = () => {
  return (
    <>
      <h3>Key terms</h3>
      <dl>
        <dt>prefetching</dt>
        <dd>add data to cache which is automatically stale, unless configured otherwise</dd>
        <dt>stale time</dt>
        <dd>
          time data is considered fresh or time before going stale and triggering refetch (default
          is 0!)
        </dd>
        <dt>cache time</dt>
        <dd>
          time an entry is cache before being garbage collected, regardless of whether it is needed
          (default 5 min)
        </dd>
        <dt>isFetching</dt>
        <dd>async query has yet to resolve</dd>
        <dt>isLoading</dt>
        <dd>isFetching + no cached data</dd>
        <dt>optimistic update</dt>
        <dd>save snapshot of state, make update before the request, rollback snapshot on error</dd>
        <dt>invalidate query</dt>
        <dd>mark as stale and refetch if currently rendered</dd>
      </dl>
    </>
  )
}
