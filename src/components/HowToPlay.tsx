export function HowToPlay() {
  return (
    <div className="how-to-play">
      <h2>How to Play</h2>

      <section>
        <h3>Turn structure</h3>
        <p>
          Each turn has three phases: <strong>Reinforce</strong> (place new armies on your
          territories), <strong>Attack</strong> (fight neighboring territories to capture them),
          and <strong>Fortify</strong> (move armies once between two of your connected territories
          to shore up your front line).
        </p>
      </section>

      <section>
        <h3>Cards: what they're for</h3>
        <p>
          Every time you capture at least one territory during your attack phase, you earn a
          card. Cards come in three shapes &mdash; <strong>infantry</strong>,{' '}
          <strong>cavalry</strong>, and <strong>artillery</strong> &mdash; plus two{' '}
          <strong>wild</strong> cards that count as any shape.
        </p>
        <p>
          Trade in a <strong>set of three</strong> (three of the same shape, or three different
          shapes) during your reinforce phase for bonus armies. The bonus grows with each set
          traded in across the whole game (4, 6, 8, 10, 12, then +5 each time), so hoarding cards
          pays off &mdash; but you're forced to trade if you're holding 5 or more cards.
        </p>
      </section>

      <section>
        <h3>Basic strategy</h3>
        <ul>
          <li>
            <strong>Hold whole continents.</strong> Controlling every territory in a continent
            gives you a flat reinforcement bonus every turn &mdash; prioritize sealing off small
            continents (like Australia or South America) early since they're cheap to defend.
          </li>
          <li>
            <strong>Attack from strength.</strong> Only attack when you have a clear numbers
            advantage; defenders roll fewer dice but win ties, so 3-vs-1 or better odds are
            safest.
          </li>
          <li>
            <strong>Defend chokepoints.</strong> Stack armies on territories with few borders
            leading into your continent so you only have to defend a small number of fronts.
          </li>
          <li>
            <strong>Don't overextend.</strong> Leave enough armies behind on captured territories
            &mdash; a lone army is easy prey next turn.
          </li>
          <li>
            <strong>Time your card trades.</strong> Trading in a set right before a big attack
            turn can fund an offensive; but don't sit on 4+ cards too long, or you'll be forced to
            cash in on a turn that isn't ideal.
          </li>
        </ul>
      </section>
    </div>
  );
}
