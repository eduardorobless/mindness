import React, { useState, useEffect } from 'react';




function App() {
    const [tableData, setTableData] = useState([])

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://[::1]:5000/api')
                const result = await response.json()
                setTableData(result)
            } catch (error) {
                console.error('Error fetching data: ', error)
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [])


    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Notes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((note) => (
                        <tr key={note._id}>
                            <td>{note.title}</td>
                            <td>{note.content}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}


export default App;