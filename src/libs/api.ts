interface Progress {
  progress: number
  eta_relative: number
  current_image: string
  textinfo: string
}

async function call(
  url: RequestInfo | URL,
  opts: RequestInit,
): Promise<[boolean] | [boolean, any]> {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...opts.headers,
    },
  })
  if (!res.ok) return [false]
  try {
    const json = await res.json()
    return [true, json]
  } catch (err) {
    console.error(err)
    return [false]
  }
}

export async function t2i(
  prompt: string,
): Promise<[boolean] | [boolean, string]> {
  const [ok, res] = await call(`${logseq.settings!.apiHost}/sdapi/v1/txt2img`, {
    method: "POST",
    body: JSON.stringify({
      prompt: `${logseq.settings!.promptPrefix}, ${prompt}`,
      negative_prompt: logseq.settings!.negativePrompt,
      sampler_index: logseq.settings!.sampler,
      steps: logseq.settings!.steps,
      width: logseq.settings!.width,
      height: logseq.settings!.height,
    }),
  })

  if (!ok) return [false]

  return [true, res.images[0]]
}

export async function progress(): Promise<[boolean] | [boolean, Progress]> {
  return await call(`${logseq.settings!.apiHost}/sdapi/v1/progress`, {
    method: "GET",
  })
}

export async function interrupt(): Promise<void> {
  await call(`${logseq.settings!.apiHost}/sdapi/v1/interrupt`, {
    method: "POST",
  })
}
