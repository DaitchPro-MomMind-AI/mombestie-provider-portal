// Real flag images instead of Unicode flag emoji. Flag emoji are two-codepoint
// regional-indicator sequences, and several platforms (notably Windows,
// depending on browser/font stack) render them as garbled boxes/blobs instead
// of the actual flag -- reported live by the user (Italy showed as a green
// smear, not the Italian flag). flagcdn.com serves real flag image assets by
// ISO 3166-1 alpha-2 code with no API key required, so this renders
// correctly and consistently regardless of the viewer's emoji font support.
interface Props {
  code: string
  width?: number
  radius?: number
  style?: React.CSSProperties
}

export default function FlagIcon({ code, width = 24, radius = 3, style }: Props) {
  const cc = code.toLowerCase()
  return (
    <img
      src={`https://flagcdn.com/w80/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 1x, https://flagcdn.com/w160/${cc}.png 2x`}
      alt=""
      width={width}
      height={Math.round(width * 0.75)}
      loading="lazy"
      style={{
        borderRadius: radius, objectFit: 'cover', flexShrink: 0, display: 'block',
        boxShadow: '0 0 0 1px rgba(17,26,58,0.1)', background: 'rgba(17,26,58,0.04)',
        ...style,
      }}
      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }}
    />
  )
}
