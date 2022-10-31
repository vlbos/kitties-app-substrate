import React from 'react'
import {
  Button,
  Card,
  Grid,
  Message,
  Modal,
  Form,
  Label,
} from 'semantic-ui-react'
import Order from '.'
// import OrderAvatar from './OrderAvatar'
// import { useSubstrateState } from './substrate-lib'
// import { TxButton } from './substrate-lib/components'
import { web3FromSource } from '@polkadot/extension-dapp'
import { OrderSide } from '/Users/lisheng/mygit/vlbos/kitties-app-substrate/.yalc/pacific-js/packages/pacific-js/index.ts'
import SalePrice from '../common/SalePrice'

// --- Transfer Modal ---
const onError = (error, setState) => {
  // Ideally, you'd handle this error at a higher-level component
  // using props or Redux
  setState({ errorMessage: error.message })
  setTimeout(() => setState({ errorMessage: null }), 3000)
  throw error
}

const fulfillOrder = async props => {
  const { currentAccount } = props

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

  let { order, accountAddress, setState } = props
  if (!accountAddress) {
    accountAddress = await getFromAcct()
  }
  try {
    setState({ creatingOrder: true })
    await this.props.seaport.fulfillOrder({ order, accountAddress })
  } catch (error) {
    onError(error, setState)
  } finally {
    setState({ creatingOrder: false })
  }
}

// --- Buy Order ---

const BuyButton = props => {
  const { accountAddress, order, creatingOrder, canAccept } = props
  const buyAsset = async () => {
    if (accountAddress && !canAccept) {
      this.setState({
        errorMessage: 'You already own this asset!',
      })
      return
    }
    this.fulfillOrder()
  }

  return (
    <Button basic color="grey" disabled={creatingOrder} onClick={buyAsset}>
      Buy
    </Button>
  )
}

// --- Set Price ---

const AcceptOfferButton = props => {
  const { creatingOrder, canAccept, accountAddress, order } = props
  const [open, setOpen] = React.useState(false)
  const [formValue, setFormValue] = React.useState({})

  const sellAsset = async () => {
    if (accountAddress && !canAccept) {
      this.setState({
        errorMessage: 'You do not own this asset!',
      })
      return
    }
    this.fulfillOrder()
  }

  return (
    <Button basic color="grey" disabled={creatingOrder} onClick={sellAsset}>
      Cancel
    </Button>
  )
}

const ExpirationBadge = () => {
  const expirationTime = parseFloat(this.props.order.expirationTime)

  if (expirationTime <= 0) {
    return null
  }

  const timeLeft = moment.duration(moment.unix(expirationTime).diff(moment()))

  return (
    <span>
      <i>timer</i>
      <span>Expires in </span>
      {timeLeft.humanize()}
    </span>
  )
}
// --- About Order Card ---

const OrderCard = props => {
  const { order, setStatus } = props
  const { makerAccount, listingTime, asset, assetBundle } = order

  const owner = asset ? asset.owner : assetBundle.assets[0].owner

  const ts = listingTime.toNumber() * 1000
  const timeLabel = moment(ts).local().fromNow()
  const isOwner =
    accountAddress &&
    accountAddress.toLowerCase() === owner.address.toLowerCase()

  const { currentAccount } = useSubstrateState()
  const isSelf = currentAccount.address === order.owner
  const [state, setState] = React.useState({
    errorMessage: null,
    creatingOrder: false,
  })

  return (
    <Card>
      {asset ? (
        <AssetMetadata asset={asset} />
      ) : (
        <BundleMetadata bundle={assetBundle} />
      )}
      {/* <OrderAvatar dna={dna.toU8a()} /> */}
      <Card.Content>
        <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
          Offered by 
        </Card.Meta>
      </Card.Content>
      {state.errorMessage ? (
        <Card.Content extra style={{ textAlign: 'center' }}>
          {state.errorMessage}
        </Card.Content>
      ) : (
        <Card.Content extra style={{ textAlign: 'center' }}>
          {order.side === OrderSide.Buy ? (
            <>
              <BuyButton order={order} setStatus={setStatus} />
            </>
          ) : (
            <></>
          )}
          {order.side === OrderSide.Sell ? (
            <>
              <AcceptOfferButton order={order} setStatus={setStatus} />
            </>
          ) : (
            <></>
          )}
        </Card.Content>
      )}
    </Card>
  )
}

export default OrderCard
