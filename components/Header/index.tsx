// General
import Image from 'next/image'
import classNamesBind from 'classnames/bind'
import Link from 'next/link'

// Styles
import styles from './styles.module.css'
const classNames = classNamesBind.bind(styles)

// Components
import Navigation from '../Navigation'

export default function Header(this: any) {
  return (
    <div className={classNames('container')}>
      <div className={classNames('title')}>
        {renderLogo()}
        <h1>
          <Link href="/">Curation Dashboard</Link>
        </h1>
      </div>
      <Navigation />
    </div>
  )
}

function renderLogo() {
  // @ts-ignore
  return (
    <div className={classNames('logo')}>
      <Image
        alt="logo"
        width={22}
        height={28}
        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyOHB4IiB2aWV3Qm94PSIwIDAgMjIgMjgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjQgKDY3Mzc4KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDE5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNZW51LS8tbm90LXNpZ25lZC1pbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTg4LjAwMDAwMCwgLTUyLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cGF0aCBkPSJNOTcuMzMzMzAxOSw2Ny41NTU1MDMyIEM5My44OTY5NDk4LDY3LjU1NTUwMzIgOTEuMTExMTAwNiw2NC43Njk4NDI1IDkxLjExMTEwMDYsNjEuMzMzMzAxOSBDOTEuMTExMTAwNiw1Ny44OTY3NjEzIDkzLjg5Njk0OTgsNTUuMTExMTAwNiA5Ny4zMzMzMDE5LDU1LjExMTEwMDYgQzEwMC43Njk4NDMsNTUuMTExMTAwNiAxMDMuNTU1NTAzLDU3Ljg5Njc2MTMgMTAzLjU1NTUwMyw2MS4zMzMzMDE5IEMxMDMuNTU1NTAzLDY0Ljc2OTg0MjUgMTAwLjc2OTg0Myw2Ny41NTU1MDMyIDk3LjMzMzMwMTksNjcuNTU1NTAzMiBNOTcuMzMzMzAxOSw1MiBDMTAyLjQ4NzkyNCw1MiAxMDYuNjY2NjA0LDU2LjE3ODY3OTUgMTA2LjY2NjYwNCw2MS4zMzMzMDE5IEMxMDYuNjY2NjA0LDY2LjQ4NzkyNDMgMTAyLjQ4NzkyNCw3MC42NjY2MDM4IDk3LjMzMzMwMTksNzAuNjY2NjAzOCBDOTIuMTc4Njc5NSw3MC42NjY2MDM4IDg4LDY2LjQ4NzkyNDMgODgsNjEuMzMzMzAxOSBDODgsNTYuMTc4Njc5NSA5Mi4xNzg2Nzk1LDUyIDk3LjMzMzMwMTksNTIgWiBNMTA2LjIxMTA2Myw3MS4xMjIxNDQ0IEMxMDYuODE4NTc2LDcxLjcyOTY1NzUgMTA2LjgxODU3Niw3Mi43MTQ0NjIyIDEwNi4yMTEwNjMsNzMuMzIxOTc1MyBMOTkuOTg4NjczNCw3OS41NDQzNjUyIEM5OS4zODExNjAzLDgwLjE1MTg3ODMgOTguMzk2MzU1Niw4MC4xNTE4NzgzIDk3Ljc4ODg0MjUsNzkuNTQ0MzY1MiBDOTcuMTgxMzI5NCw3OC45MzY4NTIxIDk3LjE4MTMyOTQsNzcuOTUyMDQ3MyA5Ny43ODg4NDI1LDc3LjM0NDUzNDIgTDEwNC4wMTEyMzIsNzEuMTIyMTQ0NCBDMTA0LjYxODc0NSw3MC41MTQ2MzEzIDEwNS42MDM1NSw3MC41MTQ2MzEzIDEwNi4yMTEwNjMsNzEuMTIyMTQ0NCBaIE0xMDkuNzc3NzA0LDUzLjU1NTU1MDMgQzEwOS43Nzc3MDQsNTQuNDE0Nzc5NyAxMDkuMDgxMzg0LDU1LjExMTEwMDYgMTA4LjIyMjM0Myw1NS4xMTExMDA2IEMxMDcuMzYzMTEzLDU1LjExMTEwMDYgMTA2LjY2Njc5Miw1NC40MTQ3Nzk3IDEwNi42NjY3OTIsNTMuNTU1NTUwMyBDMTA2LjY2Njc5Miw1Mi42OTYzMjA5IDEwNy4zNjMxMTMsNTIgMTA4LjIyMjM0Myw1MiBDMTA5LjA4MTM4NCw1MiAxMDkuNzc3NzA0LDUyLjY5NjMyMDkgMTA5Ljc3NzcwNCw1My41NTU1NTAzIFoiIGlkPSJGaWxsLTE5Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
      />
    </div>
  )
}
