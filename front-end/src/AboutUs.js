import { useState, useEffect } from 'react'
import axios from 'axios'
import loadingIcon from './loading.gif'
import './AboutUs.css'

/**
 * A React component that represents the "About Us" page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const AboutUs = props => {
    const [text, setText] = useState([])
    const [imageLink, setImageLink] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState('')

    /**
     * A nested function that fetches the "about us" information from the back-end server.
     */
    const fetchInfo = () => {
    axios
        .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/aboutus`)
        .then(response => {
            // axios bundles up all response data in response.data property
            const text = response.data.text
            const imageLink = response.data.image
            setText(text)
            setImageLink(imageLink)
        })
        .catch(err => {
            setError(err)
        })
        .finally(() => {
          // the response has been received, so remove the loading icon
          setLoaded(true)
        })
    }

    // fetch the info when the page is first loaded
    useEffect(() => {
        fetchInfo()
        // This code is based on the Messages component code but I removed the interval timer because the about us info does not update/isn't interactive
    }, []) // putting a blank array as second argument will cause this function to run only once when component first loads

    // TODO
    console.log(imageLink)

    // return the final component including all the fetched info
    return (
    <>
        <h1>About us</h1>
        {error && <p className="MessageForm-error">{error}</p>}
        {!loaded && <img src={loadingIcon} alt="loading" />}

        <img className="aboutImage" src={imageLink} alt="Charlotte"/>
        <p>{text}</p>
    </>
    )
}

// make this component available to be imported into any other file
export default AboutUs