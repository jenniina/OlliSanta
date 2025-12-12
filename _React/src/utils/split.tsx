import { Fragment } from "react"

export function split(details: string) {
  return details?.split("\n")?.map((line: string, index: number) => (
    <Fragment key={`${line}-${index}`}>
      {line}
      <br />
    </Fragment>
  ))
}
