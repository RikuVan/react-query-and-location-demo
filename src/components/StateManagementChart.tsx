import './state-types.css'

export function StateManagementChart() {
  return (
    <div>
      <h2>State Management in React</h2>
      <div className="state-types-container">
        <div className="box reactive">
          <h2>Reactive</h2>
          <p>Akita, Elf</p>
        </div>
        <div className="box atoms">
          <h2>Atomic</h2>
          <p>Recoil, Jotai</p>
        </div>
        <div className="box one-way">
          <h2>One-way immutable</h2>
          <p>Redux, Zustand</p>
        </div>
        <div className="box two-way">
          <h2>Two-way magic</h2>
          <p>MobX, Valtio</p>
        </div>
        <div className="box api">
          <h2>Server state</h2>
          <p>swr, React-query, React-location, Apollo-Client</p>
        </div>
        <div className="box react">
          <h2>Just React</h2>
          <p>useReducer, useState, useMemo...</p>
        </div>
        <div className="box fsm">
          <h2>fsm</h2>
          X-state, robot
        </div>
      </div>
    </div>
  )
}
