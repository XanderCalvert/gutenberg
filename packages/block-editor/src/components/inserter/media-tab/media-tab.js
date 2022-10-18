/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import {
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	__experimentalHStack as HStack,
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
	__experimentalNavigatorButton as NavigatorButton,
	__experimentalNavigatorBackButton as NavigatorBackButton,
	FlexBlock,
	Button,
} from '@wordpress/components';
import { Icon, chevronRight, chevronLeft } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { MediaCategoryPanel } from './media-panel';
import MediaUploadCheck from '../../media-upload/check';
import MediaUpload from '../../media-upload';
import { useMediaCategories } from './hooks';

function MediaTab( {
	rootClientId,
	selectedCategory,
	onSelectCategory,
	onInsert,
} ) {
	const mediaCategories = useMediaCategories( rootClientId );
	const isMobile = useViewportMatch( 'medium', '<' );
	const baseCssClass = 'block-editor-inserter__media-tabs';
	return (
		<>
			{ ! isMobile && (
				<div className={ `${ baseCssClass }-container` }>
					<nav aria-label={ __( 'Media categories' ) }>
						<ItemGroup role="list" className={ baseCssClass }>
							{ mediaCategories.map( ( mediaCategory ) => (
								<Item
									role="listitem"
									key={ mediaCategory.name }
									onClick={ () =>
										onSelectCategory( mediaCategory )
									}
									className={ classNames(
										`${ baseCssClass }__media-category`,
										{
											'is-selected':
												selectedCategory ===
												mediaCategory,
										}
									) }
									aria-label={ mediaCategory.label }
									aria-current={
										mediaCategory === selectedCategory
											? 'true'
											: undefined
									}
								>
									<HStack>
										<FlexBlock>
											{ mediaCategory.label }
										</FlexBlock>
										<Icon icon={ chevronRight } />
									</HStack>
								</Item>
							) ) }

							<div
								role="presentation"
								className={ `${ baseCssClass }__fill-space` }
							/>
							<div role="listitem">
								<MediaUploadCheck>
									<MediaUpload
										multiple={ false }
										// onSelect={ ( media ) => selectMedia( media, onClose ) }
										// allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<Button
												onClick={ open }
												className="block-editor-inserter__media-library-button"
												variant="secondary"
											>
												{ __( 'Open Media Library' ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
							</div>
						</ItemGroup>
					</nav>
				</div>
			) }
			{ isMobile && (
				<MediaTabNavigation
					onInsert={ onInsert }
					rootClientId={ rootClientId }
					mediaCategories={ mediaCategories }
				/>
			) }
		</>
	);
}

function MediaTabNavigation( { onInsert, rootClientId, mediaCategories } ) {
	return (
		<NavigatorProvider initialPath="/">
			<NavigatorScreen path="/">
				<ItemGroup>
					{ mediaCategories.map( ( category ) => (
						<NavigatorButton
							key={ category.name }
							path={ `/category/${ category.name }` }
							as={ Item }
							isAction
						>
							<HStack>
								<FlexBlock>{ category.label }</FlexBlock>
								<Icon
									icon={
										isRTL() ? chevronLeft : chevronRight
									}
								/>
							</HStack>
						</NavigatorButton>
					) ) }
				</ItemGroup>
			</NavigatorScreen>
			{ mediaCategories.map( ( category ) => (
				<NavigatorScreen
					key={ category.name }
					path={ `/category/${ category.name }` }
				>
					<NavigatorBackButton
						className="rigatonious"
						icon={ isRTL() ? chevronRight : chevronLeft }
						isSmall
						aria-label={ __( 'Navigate to the categories list' ) }
					>
						{ __( 'Back' ) }
					</NavigatorBackButton>
					<MediaCategoryPanel
						rootClientId={ rootClientId }
						onInsert={ onInsert }
						category={ category }
					/>
				</NavigatorScreen>
			) ) }
		</NavigatorProvider>
	);
}

export default MediaTab;
