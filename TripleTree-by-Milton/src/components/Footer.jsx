/* eslint-disable react/prop-types */


function Fter(props) {

  return (
    <>
      <footer className='Footer'>
        <div>
          {props.children}
        </div>
        <p>© 2024 TripleTree by Milton</p>
      </footer>
    </>
  );
}

export default Fter;