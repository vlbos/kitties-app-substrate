import React from 'react'
const BundleMetadata = props => {

   const { bundle } = props

    return (
      <div>
        <a target="_blank" rel="noopener noreferrer" className="text-center d-inline-block m-100" href={bundle.permalink}>
            {bundle.assets.map((asset, i) =>
              <img
                className="small"
                alt="Asset Bundle artwork"
                key={i}
                src={asset.imageUrlThumbnail || asset.imageUrl} />
            )}
        </a>
          
        <div className="card-body h-25">
          <h5 className="card-title">{bundle.name}</h5>
          <p className="card-text text-truncate">
            <a target="_blank" rel="noopener noreferrer" href={bundle.permalink} className="card-link">
              {bundle.description}
              <br />
              {bundle.externalLink}
            </a>
          </p>
        </div>
      </div>
    )
  }

export default  BundleMetadata 