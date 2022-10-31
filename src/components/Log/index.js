import React, { useEffect, useState }  from 'react'
import {
  Button,
  Card,
  Grid,
  Message,
  Modal,
  Form,
  Label,
} from 'semantic-ui-react'
import Order from '../Order';
// import OrderAvatar from './OrderAvatar'
// import { useSubstrateState } from './substrate-lib'
// import { TxButton } from './substrate-lib/components'

// --- Transfer Modal ---

const OrderCards = async ( props) => {
    const [state, setState] = useState({
    orders: undefined,
    total: 0,
    side: undefined,
    onlyForMe: false,
    onlyByMe: false,
    onlyBundles: false,
    page: 1,
  })
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
        await fetchData(props);
   const { orders } = state
  if (orders == null||orders===undefined || orders.length === 0) {
    return (
      <Message info>
        <Message.Header>
          No Order found here... Create one now!&nbsp;
          <span role="img" aria-label="point-down">
            👇
          </span>
        </Message.Header>
      </Message>
    )
  }

  return (
    <Grid columns={3}>
      {orders.map((order, i) => (
        <Grid.Column key={`${i}`}>
          <Order {...props} key={i} order={order}  />
        </Grid.Column>
      ))}
    </Grid>
  )
}

export default OrderCards
