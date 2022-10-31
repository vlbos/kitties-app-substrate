import React, { useEffect, useState } from 'react'
import { Grid, Form, Dropdown, Input, Label } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import { Button } from 'semantic-ui-react'
import { OrderSide } from 'pacific-js'

const argIsOptional = arg => arg.type.toString().startsWith('Option<')

function Main(props) {
  const { api, jsonrpc } = useSubstrateState()
  const [status, setStatus] = useState(null)
  const [state, setState] = useState({
    orders: undefined,
    total: 0,
    side: undefined,
    onlyForMe: false,
    onlyByMe: false,
    onlyBundles: false,
    page: 1,
  })
  const { page, total } = state
  const ordersPerPage = props.seaport.api.pageSize
  const noMorePages = page * ordersPerPage >= total
const {currentAccount}=props;
  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
    // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  }
const fetchData = async props => {
      const { accountAddress } = props
      const { orders, count } = await props.seaport.api.getOrders(
        {
          maker: state.onlyByMe ? accountAddress : undefined,
          owner: state.onlyForMe ? accountAddress : undefined,
          side: state.side,
          bundled: state.onlyBundles ? true : undefined,
          // Possible query options:
          // 'asset_contract_address'
          // 'taker'
          // 'token_id'
          // 'token_ids'
          // 'sale_kind'
        },
        state.page
      )

      setState({ orders, total: count })
    }
//   useEffect(() => {
    
//     fetchData()
//   }, [props, state])

  const toggleSide = (ev, side) => {
    if (state.side === side) {
      side = undefined
    }
    setState(
      {
        orders: undefined,
        side,
        onlyForMe: undefined,
      },
      () => fetchData()
    )
  }

  const toggleForMe = async (ev, side) => {
    let { accountAddress } = props
    if (!accountAddress) {
      accountAddress = await getFromAcct()
    }
    const { onlyForMe } = state
   setState(
      {
        orders: undefined,
        onlyForMe: !onlyForMe,
        onlyByMe: false,
        // Doesn't make sense to show sell orders the user makes
        side: onlyForMe ? undefined : OrderSide.Buy,
      },
      () => fetchData()
    )
  }

  const toggleByMe = async (ev, side) => {
    let { accountAddress } = props
    if (!accountAddress) {
      accountAddress = await getFromAcct()
    }
    const { onlyByMe } =state
   setState(
      {
        orders: undefined,
        onlyByMe: !onlyByMe,
        onlyForMe: false,
      },
      () =>fetchData()
    )
  }

  const toggleBundles = (ev, side) => {
    const { onlyBundles } =state
   setState(
      {
        orders: undefined,
        onlyBundles: !onlyBundles,
        onlyByMe: false,
        // Only sell-side for now
        side: OrderSide.Sell,
      },
      () =>fetchData()
    )
  }

  return (
    <Grid.Column width={8}>
      <h1>Pallet Interactor</h1>
      <Form>
        <Form.Group style={{ overflowX: 'auto' }} inline>
          <label>Interaction Type</label>
          <Form.Radio
            label="Auctions"
            name="buySellInterxType"
            value="OrderSide.Sell"
            checked={interxType === 'OrderSide.Sell'}
            onChange={toggleSide}
          />
          <Form.Radio
            label="Bids"
            name="buySellInterxType"
            value="OrderSide.Buy"
            checked={interxType === 'OrderSide.Buy'}
            onChange={toggleSide}
          />
        </Form.Group>
        <Form.Group style={{ overflowX: 'auto' }} inline>
          <label>By For Me Interaction Type</label>
          <Form.Radio
            label="For Me"
            name="meinterxType"
            value="FORME"
            checked={interxType === 'FORME'}
            onChange={toggleForMe}
          />
          <Form.Radio
            label="By Me"
            name="meinterxType"
            value="BYME"
            checked={interxType === 'BYME'}
            onChange={toggleByMe}
          />
        </Form.Group>
        <Form.Group style={{ overflowX: 'auto' }} inline>
          <label>bundle Interaction Type</label>
          <Form.Radio
            label="Bundles"
            name="BundlesinterxType"
            value="BUNDLESEXTRINSIC"
            checked={interxType === 'BUNDLESEXTRINSIC'}
            onChange={toggleBundles}
          />
          <Form.Radio
            label="Bundles1"
            name="BundlesinterxType"
            value="BUNDLES1"
            checked={interxType === 'BUNDLES1'}
            onChange={toggleBundles}
          />
        </Form.Group>
        <Form.Field style={{ textAlign: 'center' }}>
          <Button
            basic
            type="submit"
            onClick={() => paginateTo(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            basic
            type="submit"
            onClick={() => paginateTo(page + 1)}
            disabled={noMorePages}
          >
            Previous
          </Button>
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}

export default function PageFilter(props) {
  const { api } = useSubstrateState()
  return api.tx ? <Main {...props} /> : null
}
