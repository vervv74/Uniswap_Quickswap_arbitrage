// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "hardhat/console.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";

interface QuickswapRouter {
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function WETH() external pure returns (address);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract Interface {
    function transfer(
        address _token,
        uint256 amount,
        address recepient
    ) public returns (bool) {
        IERC20 ERC20 = IERC20(_token);
        return ERC20.transfer(recepient, amount);
    }

    function transferFrom(
        address _token,
        address sender,
        address dst,
        uint256 wad
    ) public returns (bool) {
        // if contract is msg.sender but not sender
        console.log("transfer %s", wad);
        return IERC20(_token).transferFrom(sender, dst, wad);
    }

    function balanceMatic(address _address) public view returns (uint256) {
        console.log("balance eth %s", _address.balance);
        return _address.balance;
    }

    function transferMatic_toContract(address payable _address) public payable {
        (bool sent, bytes memory data) = _address.call{value: msg.value}("");
    }

    function balance(address _token, address acc)
        public
        view
        returns (uint256)
    {
        uint256 qwe = IERC20(_token).balanceOf(acc);
        console.log("balance %s %s", _token, qwe);
        return qwe;
    }

    function _msg() public view returns (address) {
        address qwe = msg.sender;
        console.log("msg.sender %s", qwe);
        return qwe;
    }

    //Uniswap
    function swapExactInputSingle(
        address inToken,
        address outToken,
        uint24 poolFee,
        uint256 amountIn
    ) public returns (uint256 amountOut) {
        address iSwapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
        // approve(inToken, iSwapRouter, amountIn);
        TransferHelper.safeApprove(inToken, iSwapRouter, amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: inToken,
                tokenOut: outToken,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 1000,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = ISwapRouter(iSwapRouter).exactInputSingle(params);
    }

    function poolAdress(
        address _token0,
        address _token1,
        uint24 _fee
    ) external view returns (address poolAddress) {
        address Factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
        PoolAddress.PoolKey memory poolKey = PoolAddress.PoolKey({
            token0: _token0,
            token1: _token1,
            fee: _fee
        });
        address _poolAddress = PoolAddress.computeAddress(Factory, poolKey);
        console.log("pooladdress %s", _poolAddress);
        return _poolAddress;
    }

    //Quickswap && Sushiswap
    function swapExactETHForTokens(address token, address Router)
        public
        payable
        returns (uint256)
    {
        address[] memory path = new address[](2);
        path[0] = QuickswapRouter(Router).WETH();
        path[1] = token;
        uint256[] memory amounts = QuickswapRouter(Router)
            .swapExactETHForTokens{value: msg.value}(
            1,
            path,
            address(this),
            block.timestamp + 1000
        );
        return amounts[1];
    }

    function swapExactTokenForTokens(
        uint256 amountIn,
        address token0,
        address token1,
        address Router
    ) public returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;
        IERC20(token0).approve(Router, amountIn);
        uint256[] memory amounts = QuickswapRouter(Router)
            .swapExactTokensForTokens(
                amountIn,
                0,
                path,
                address(this),
                block.timestamp + 1000
            );
        console.log("amountout %s", amounts[1]);
        return amounts[1];
    }

    function getAmountsOut(
        uint256 amountIn,
        address token0,
        address token1,
        address Router
    ) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = address(token0);
        path[1] = address(token1);
        uint256[] memory amounts = QuickswapRouter(Router).getAmountsOut(
            amountIn,
            path
        );
        console.log("amount0 %s", amounts[0]);
        console.log("amount1 %s", amounts[1]);
        return amounts[1];
    }

    function swapExactTokensForETH(
        uint256 amountIn,
        address token0,
        address Router
    ) public returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
        IERC20(token0).approve(Router, amountIn);
        uint256[] memory amounts = QuickswapRouter(Router)
            .swapExactTokensForETH(
                amountIn,
                0,
                path,
                address(this),
                block.timestamp + 1000
            );
        return amounts[1];
    }
}
