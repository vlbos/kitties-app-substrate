import React from 'react'
import { toUnitAmount } from '../../constants';

const SalePrice = props =>{


    const { order } = this.props
    const { currentPrice, paymentTokenContract } = order
    const price = toUnitAmount(currentPrice, paymentTokenContract)
    const priceLabel = parseFloat(price).toLocaleString(undefined, { minimumSignificantDigits: 1 })
    const isETH = paymentTokenContract.symbol === "ETH"

    return (
      <p>
        {isETH
          ? "Ξ"
          : null
        }
        {priceLabel} {isETH ? null : paymentTokenContract.symbol}
      </p>
    )
  }

export default  SalePrice 