import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { ChangeEventHandler, FormEvent, useState } from 'react'
import axios from 'axios'
interface IArticles {
    id: number;
    title: string;
    description: string;
    body: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const initialValue = {
    id: 0,
    title: '',
    description: '',
    body: '',
    published: false,
    createdAt: new Date(),
    updatedAt: new Date()
}

const BASE_URL = 'http://localhost:4000/api'
export default function Article() {
    const [articleSelected, setArticleSelected] = useState<IArticles>(initialValue)
    const queryClient = useQueryClient()

    const articleQuery = useQuery({
        queryFn: async () => {
            return (await axios.get(BASE_URL + '/articles')).data
        },
        queryKey: ['articles']
    })

    const articleMutation = useMutation({
        mutationFn: () => {
            const formdata = {
                title: articleSelected.title,
                body: articleSelected.body,
                description: articleSelected.description,
                published: articleSelected.published
            }

            if (articleSelected.id === 0) {
                return axios.post(BASE_URL + '/articles', formdata)
            } else {
                return axios.put(BASE_URL + '/articles/' + articleSelected.id, formdata)
            }
        },
        onSuccess({ data }, variables, context) {
            updateQuery(data, articleSelected.id === 0 ? 'add' : 'update')
        },
    })

    const deleteMutaion = useMutation({
        mutationFn: async (id: number) => {
            const res = await axios.delete(BASE_URL + '/articles/' + id)
            return res.data
        },
        onSuccess(data: IArticles, variables, context) {
            updateQuery(data, "delete", data.id)
        },
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        articleMutation.mutate()
    }

    const updateQuery = (data: IArticles, aksi: 'add' | 'update' | 'delete', id?: number) => {
        queryClient.setQueryData(
            ['articles'],
            (oldData: any) => {
                if (aksi === 'add') {
                    return [...oldData, data]
                } else if (aksi === "delete") {
                    return oldData?.filter((article: IArticles) => article.id !== id)
                }
                return oldData?.map((article: IArticles) => article.id === articleSelected.id ? data : article)
            }
        )
        setArticleSelected(initialValue)
    }
    return (
        <div className='p-4'>
            <div className='row'>
                <div className='col-md-8'>
                    <div className="row">
                        {
                            articleQuery.data?.map((article: IArticles) => {
                                return <div key={article.id} className="col-md-6 card p-2" >
                                    <div className='card-header'>
                                        <span>{article.title}</span>
                                    </div>
                                    <div className='card-body'>
                                        <p>{article.body}</p>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <button className='btn btn-warning' onClick={() => setArticleSelected(article)}>Edit</button>
                                        <button className='btn btn-danger' onClick={() => deleteMutaion.mutate(article.id)}>Delete</button>
                                    </div>

                                </div>
                            })
                        }
                    </div>
                </div>
                <div className='col-md-4'>
                    <h1>FORM</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" required
                                value={articleSelected.title}
                                onChange={(e) => setArticleSelected(p => ({ ...p, title: e.target.value }))}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Body</label>
                            <input type="text" className="form-control" required
                                value={articleSelected.body}
                                onChange={(e) => setArticleSelected(p => ({ ...p, body: e.target.value }))}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input type="text" className="form-control" required
                                value={articleSelected.description}
                                onChange={(e) => setArticleSelected(p => ({ ...p, description: e.target.value }))}
                            />
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox"
                                    checked={articleSelected.published}
                                    onChange={(e) => setArticleSelected(p => ({ ...p, published: e.target.checked }))}
                                />
                                <label className="form-check-label">
                                    Publish
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>

            </div>

        </div>
    )
}
