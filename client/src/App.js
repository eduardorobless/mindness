import React, { useState, useEffect } from 'react';




function App() {
    const [tableData, setTableData] = useState([])

    const [loading, setLoading] = useState(true)


    const [editingRow, setEditingRow] = useState(null)

    const [newRow, setNewRow] = useState({ 'title': '', 'content': '' })
    const [isAdding, setIsAdding] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://[::1]:5000/api')
                const result = await response.json()

                const sortedData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                setTableData(sortedData)
            } catch (error) {
                console.error('Error fetching data: ', error)
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [])



    const handleAddRow = () => {
        setIsAdding(true)
    }

    const handleChange = (e) => {
        setNewRow((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }


    const handleConfirm = async () => {
        if (isAdding) {
            try {

                const response = await fetch(`http://[::1]:5000/api`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRow),
                })

                if (response.ok) {
                    const result = await response.json()
                    setTableData((prevData) => [result, ...prevData])
                    resetFields()
                } else {
                    console.error('Failed to add note')
                }

            } catch (error) {
                console.error('Error adding note: ', error)

            }

        } else {
            try {
                const response = await fetch(`http://[::1]:5000/api/${editingRow}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRow)
                })

                if (response.ok) {

                    setTableData((prevData) =>
                        prevData.map((note) =>
                            note._id == editingRow ? { ...note, ...newRow } : note
                        ))

                    resetFields()

                } else {
                    console.error('Failed to update note')
                }
            } catch (error) {
                console.error('Error updating note: ', error)
            }
        }

    }

    const handleCancel = () => {
        resetFields()
    }

    const handleEdit = (note) => {
        setEditingRow(note._id)
        setNewRow({ title: note.title, content: note.content })
    };



    const handleDelete = async (note) => {
        try {
            const response = await fetch(`http://[::1]:5000/api/${note._id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                setTableData((prevData) =>
                    prevData.filter((item) => item._id !== note._id)
                )
            }
            else {
                console.error('Failed to delete note')
            }
        } catch (error) {
            console.error('Error deleting note: ', error)
        }

    }

    const resetFields = () => {
        setEditingRow(null)
        setNewRow({ title: '', content: '' })
        setIsAdding(false)
    }


    const handleAdd = async () => {

    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Notes</h1>
            <button onClick={handleAddRow}>Add Row</button>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {isAdding && (
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    name="title"
                                    value={newRow.title}
                                    onChange={handleChange}
                                    placeholder="Title" />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="content"
                                    value={newRow.content}
                                    onChange={handleChange}
                                    placeholder="Content" />
                            </td>
                            <td>
                                <button onClick={handleConfirm}>Confirm</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </td>
                        </tr>
                    )}

                    {tableData.map((note) => (
                        <tr key={note._id}>
                            <td>

                                {editingRow === note._id ? (
                                    <input
                                        type="text"
                                        name="title"
                                        value={newRow.title}
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
                                            value={newRow.content}
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

                            <td>
                                <button onClick={() => handleDelete(note)}> Delete </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}


export default App;