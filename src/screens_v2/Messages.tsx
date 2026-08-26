import type { Screen } from '../App'
import BottomNav from '../components/BottomNav'

interface Props { navigate: (s: Screen) => void }

/**
 * MBPRV-49: honest empty-inbox state, matching admin-portal's
 * CommunicationsPage disclosure ("No real messaging table/pipeline is
 * wired to this view -- customer/provider chat data doesn't flow through
 * the admin portal yet.").
 *
 * Previously this screen rendered four fully-fixture conversation threads
 * (fake customers, fake unread badges, fake last-message previews) and a
 * fake chat with a fake "AI Reply Suggestion" that inserted a canned reply
 * as if a real model had generated it. All of that is removed -- no real
 * `messages` table exists yet (tracked in MBADM-83), so there is nothing
 * real to list, and simulating one is worse than an honest empty state.
 */
export default function Messages({ navigate }: Props) {
  return (
    <div style={{ height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '48px 20px 0', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: '#111A3A', marginBottom: 16 }}>Messages</div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 32px' }}>
        <div style={{
          borderRadius: 20, padding: '28px 24px', textAlign: 'center',
          background: 'rgba(17,26,58,0.04)', border: '1px solid rgba(17,26,58,0.08)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#111A3A', marginBottom: 8 }}>
            Messaging isn't wired to a real inbox yet
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(17,26,58,0.5)', lineHeight: 1.55 }}>
            No real messaging table/pipeline is connected to this view -- customer/provider chat data doesn't flow through the app yet. Real messaging is tracked in MBADM-83.
          </div>
        </div>
      </div>

      <BottomNav current="messages" navigate={navigate}/>
    </div>
  )
}
