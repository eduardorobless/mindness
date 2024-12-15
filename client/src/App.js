import React, { useState, useEffect } from 'react';




function App() {
    const [tableData, setTableData] = useState([])

    const [loading, setLoading] = useState(true)


    const [editingRow, setEditingRow] = useState(null)
    const [editedRowData, setEditedRowData] = useState({ title: '', content: '' })

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


    const handleEdit = (note) => {
        console.log('editing: ', note._id)

        setEditingRow(note._id)
        setEditedRowData({ title: note.title, content: note.content })
    };

    const handleChange = (e) => {
        setEditedRowData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleConfirm = async () => {
        try {
            const response = await fetch(`http://[::1]:5000/api/${editingRow}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedRowData)
            })

            if (response.ok) {

                setTableData((prevData) =>
                    prevData.map((note) =>
                        note._id == editingRow ? { ...note, ...editedRowData } : note
                    ))

                resetFields()

            } else {
                console.error('Failed to update data')
            }
        } catch (error) {
            console.error('Error updating data: ', error)
        }
    }

    const handleCancel = () => {
        resetFields()
    }

    const resetFields = () => {
        setEditingRow(null)
        setEditedRowData({ title: '', content: '' })
    }




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
                            <td>

                                {editingRow === note._id ? (
                                    <input
                                        type="text"
                                        name="title"
                                        value={editedRowData.title}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    note.title
                                )
                                }
                            </td>

                            <td>
                                {
                                    editingRow === note._id ? (
                                        <input
                                            type="text"
                                            name="content"
                                            value={editedRowData.content}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        note.content
                                    )
                                }

                            </td>
                            <td>
                                {
                                    editingRow === note._id ? (
                                        <>
                                            <button onClick={handleConfirm}>Confirm</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEdit(note)} >Edit</button>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}


export default App;