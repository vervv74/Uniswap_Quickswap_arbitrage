// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "./Interface.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3FlashCallback.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@uniswap/v3-periphery/contracts/base/PeripheryPayments.sol";
import "@uniswap/v3-periphery/contracts/base/PeripheryImmutableState.sol";
import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-periphery/contracts/libraries/CallbackValidation.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract MyContract is
    Interface,
    IUniswapV3FlashCallback,
    PeripheryImmutableState,
    PeripheryPayments
{
    using LowGasSafeMath for uint256;
    using LowGasSafeMath for int256;
    ISwapRouter public immutable swapRouter;
    uint256 amount;
    uint256 amount1;
    event Bal(uint256, string);
    uint256 amount0;
     enum Direction {
        Quickswap,
        Sushiswap
    }

    constructor(
        ISwapRouter _swapRouter,
        address _factory,
        address _WETH9
    ) PeripheryImmutableState(_factory, _WETH9) {
        swapRouter = _swapRouter;
    }

    function uniswapV3FlashCallback(
        uint256 fee0, ////this is fee2 for first swap
        uint256 fee1, ////this is fee3 for second swap
        bytes calldata data
    ) external override {
        FlashCallbackData memory decoded = abi.decode(
            data,
            (FlashCallbackData)
        );
        CallbackValidation.verifyCallback(factory, decoded.poolKey);
        balance(decoded.poolKey.token0, address(this));
        balance(decoded.addressReal, address(this));

        uint256 token1out = swapExactInputSingle(
            decoded.poolKey.token0,
            decoded.addressReal,
            decoded.fee4,
            decoded.amount0
        );
        amount = balance(decoded.poolKey.token0, address(this));
        amount1 = balance(decoded.addressReal, address(this));
        emit Bal(amount, "USDC before swap");
        emit Bal(amount1, "WMATIC before swap");
         if (decoded.direction == Direction.Quickswap) {
            swapExactTokenForTokens(
            token1out,
            decoded.addressReal,
            decoded.poolKey.token0,
            0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
        );
         }
         else if(decoded.direction == Direction.Sushiswap) {
             swapExactTokenForTokens(
            token1out,
            decoded.addressReal,
            decoded.poolKey.token0,
            0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506
        );
         }
        uint256 amount0Owed = LowGasSafeMath.add(decoded.amount0, fee0);
        balance(decoded.poolKey.token0, address(this));
        balance(decoded.addressReal, address(this));
        TransferHelper.safeApprove(
            decoded.poolKey.token0,
            address(this),
            amount0Owed
        ); // this is for returning fl to pool (msg.sender)

        if (amount0Owed > 0)
            pay(decoded.poolKey.token0, address(this), msg.sender, amount0Owed); //return flash sum back to swaprouter (msg.sender)
        amount = balance(decoded.poolKey.token0, address(this));
        amount1 = balance(decoded.addressReal, address(this));
        emit Bal(amount, "USDC after swap");
        emit Bal(amount1, "WMATIC after swap");
    }

    struct FlashParams {
        address token0;
        address token1;
        uint24 fee1;
        uint256 amount0;
        uint256 amount1;
        uint24 fee2;
        uint24 fee3;
        address token2; // real transfer token address when get USDC from USDC_USDT pool, but sell USDC for WMATIC
        uint24 fee4; //real transfer fee when get USDC from USDC_USDT pool, but sell USDC for WMATIC
        Direction _direction;
    }
    // fee2 and fee3 are the two other fees associated with the two other pools of token0 and token1
    struct FlashCallbackData {
        uint256 amount0;
        uint256 amount1;
        address payer;
        PoolAddress.PoolKey poolKey;
        uint24 poolFee2;
        uint24 poolFee3;
        address addressReal;
        uint24 fee4;
        Direction direction;
    }

    /// @param params The parameters necessary for flash and the callback, passed in as FlashParams
    /// @notice Calls the pools flash function with data needed in `uniswapV3FlashCallback`
    function initFlash(FlashParams memory params) external {
        PoolAddress.PoolKey memory poolKey = PoolAddress.PoolKey({
            token0: params.token0,
            token1: params.token1,
            fee: params.fee1
        });
        IUniswapV3Pool pool = IUniswapV3Pool(
            PoolAddress.computeAddress(factory, poolKey)
        );
        // recipient of borrowed amounts
        // amount of token0 requested to borrow
        // amount of token1 requested to borrow
        // need amount 0 and amount1 in callback to pay back pool
        // recipient of flash should be THIS contract
        pool.flash(
            address(this),
            params.amount0,
            params.amount1,
            abi.encode(
                FlashCallbackData({
                    amount0: params.amount0,
                    amount1: params.amount1,
                    payer: msg.sender,
                    poolKey: poolKey,
                    poolFee2: params.fee2,
                    poolFee3: params.fee3,
                    addressReal: params.token2,
                    fee4: params.fee4,
                    direction: params._direction
                })
            )
        );
    }
}
