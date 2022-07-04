type EthereumProps = {};

function Ethereum({}: EthereumProps) {
  return (
    <g id="Ethereum">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="translate"
        values="0 0; 0 10;0 0 "
        begin="0s"
        dur="4s"
        repeatCount="indefinite"
      />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 1207.41 619.81; -45 1207.41 619.81;45 1207.41 619.81;0 1207.41 619.81"
        // from="0 1245.84 534.38"
        // to="360 1245.84 534.38"
        dur="12s"
        repeatCount="indefinite"
        additive="sum"
      />
      <circle className="cls-13" cx="1207.41" cy="619.81" r="28.16" />
      <circle className="cls-10" cx="1203.73" cy="619.81" r="28.16" />
      <circle className="cls-13" cx="1203.73" cy="619.81" r="21.24" />
      <g>
        <path
          className="cls-8"
          d="M1203.74,602.77c.56,.93,1.1,1.83,1.64,2.73,2.95,4.92,5.9,9.84,8.86,14.76,.1,.16,.07,.22-.08,.32-3.43,2.1-6.86,4.2-10.28,6.31-.1,.06-.17,.07-.27,0-3.44-2.12-6.89-4.23-10.34-6.34-.14-.08-.13-.14-.06-.26,3.48-5.79,6.95-11.58,10.42-17.36,.03-.05,.06-.09,.1-.16Z"
        />
        <path
          className="cls-8"
          d="M1193.21,621.92c.93,.61,1.87,1.22,2.8,1.84,2.53,1.66,5.06,3.31,7.59,4.98,.13,.08,.2,.04,.3-.02,2.9-1.9,5.79-3.8,8.69-5.69,.51-.34,1.03-.67,1.54-1.01,.04-.03,.08-.07,.16-.07-.3,.43-.6,.85-.9,1.27-3.17,4.49-6.33,8.97-9.5,13.46-.02,.02-.03,.04-.05,.07-.09,.18-.15,.11-.23-.01-1.38-1.96-2.77-3.92-4.15-5.88-2.07-2.93-4.14-5.87-6.21-8.8-.02-.03-.04-.07-.07-.1l.02-.02Z"
        />
      </g>
    </g>
  );
}

export default Ethereum;
