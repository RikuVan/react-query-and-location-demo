import { ReduxVsQueryTable } from './components/ReduxVsQueryTable'

export function Home() {
  return (
    <main>
      <h1>Home</h1>
      <h3>Do we need Redux?</h3>
      <blockquote>
        For a vast majority of applications, the truly globally accessible client state that is left
        over after migrating all of your async code to React Query is usually very tiny.
      </blockquote>
      <h3>What common problems are we solving?</h3>
      <ul>
        <li>Prop drilling</li>
        <li>Waterfall loading</li>
        <li>Rerenders</li>
        <li>UI synchronization</li>
        <li>Stale state</li>
        <li>First paint</li>
        <li>Complexity</li>
      </ul>
      <ReduxVsQueryTable />
    </main>
  )
}
