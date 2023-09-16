import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react'
import invariant from 'tiny-invariant';

import { createPost } from '~/models/post.server';

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();

    const title = formData.get("title");
    const slug  = formData.get("slug");
    const markdown = formData.get("markdown");

    const errors = {
        title: title ? null : "Title is required",
        slug:  slug ? null : "slug is required",
        markdown: markdown ? null : "markdown is required",
    };
    const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
    )

    if (hasErrors) 
    {
        return json(errors);
    }

    invariant(
        typeof title === "string",
        "title must be string"
    );

    invariant(
        typeof slug === "string",
        "slug must be string"
    );

    invariant(
        typeof markdown === "string",
        "markdown must be string"
    )

    await createPost({ title, slug, markdown });

    return redirect("/posts/admin");

}
 
const inputClassName = "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export default function NewPosts() {
    const errors  = useActionData<typeof action>();
    return (
        <Form method="post">
            <p>
                <label>
                    Post Title: {" "}
                    {errors?.title ? (
                        <em className='text-red-600'>{errors.title}</em>
                    ): null }
                    <input 
                        type="text"
                        name="title"
                        className={inputClassName}
                    />
                </label>
            </p>
            <p>
                <label>
                    Post Slug: {" "}
                    {errors?.slug ? (
                        <em className='text-red-500'>{errors.slug}</em>
                    ): null}
                    <input 
                        type="text"
                        name="slug"
                        className={inputClassName}
                    />
                </label>
            </p>
            <p>
                <label htmlFor='markdown'>Markdown: </label>
                {errors?.markdown? (
                    <em className='text-red-500'>{errors.markdown}</em>
                ): null}
                <br />
                <textarea
                    id="markdown"
                    rows={20}
                    name="markdown"
                    className={`${inputClassName} font-mono`}
                />
            </p>
            <p className='text-right'>
                <button 
                    type="submit"
                    className='rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300'
                >
                    Create Post
                </button>
            </p>
        </Form>
    )
}