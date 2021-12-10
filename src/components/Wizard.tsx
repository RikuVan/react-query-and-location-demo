import { FormData, queryClient, useForm } from '../App'
import { Link, useNavigate } from 'react-location'

export function WizardOne() {
  const { setData } = useForm()
  const navigate = useNavigate()
  return (
    <div>
      <label>
        Name
        <input type="text" name="name" onChange={(e) => setData({ name: e.target.value })} />
      </label>
      <div className="wizard-buttons">
        <button onClick={() => navigate({ to: '/form' })}>Back</button>
        <button onClick={() => navigate({ to: '/form/2' })}>Next</button>
      </div>
    </div>
  )
}

export function WizardTwo() {
  const { setData, mutation } = useForm()
  const navigate = useNavigate()
  return (
    <div>
      <label>
        Favorite city
        <input
          type="text"
          name="favoriteCity"
          onChange={(e) => setData({ favoriteCity: e.target.value })}
        />
      </label>
      <div className="wizard-buttons">
        <button onClick={() => navigate({ to: '/form/1' })}>Back</button>
        <button onClick={() => mutation.mutate()}>Submit</button>
      </div>
    </div>
  )
}

export function WizardSuccess() {
  const query = queryClient.getQueryState<FormData>('form')
  return (
    <div>
      <img src="https://i.imgur.com/XJyemeI.jpeg" alt="success" />
      <pre>{JSON.stringify(query?.data, null, 2)}</pre>
      <p>
        <Link to={`/weather/${query?.data?.favoriteCity}`}>
          Check out the weather for {query?.data?.favoriteCity}
        </Link>
      </p>
    </div>
  )
}

export function WizardFailure() {
  return (
    <div>
      <h3>Sorry, something went wrong</h3>
      <Link to={'/form'}>Try again</Link>
    </div>
  )
}
